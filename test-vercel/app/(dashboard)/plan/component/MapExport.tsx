'use client'
import React, { useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdOutlineMyLocation } from 'react-icons/md';
import { Button } from '@nextui-org/react';
import { useThemeContext } from '@/providers/ThemeProvider';
import { darkTheme } from '../MapTheme/dark';
import { lightTheme } from '../MapTheme/light';

function MapExport() {
    const { theme, setTheme } = useThemeContext()
    const containerStyle = {
        width: '100%',
        height: '100%',
    };

    const mapOptions = {
        disableDefaultUI: true,
        minZoom: 4,
        maxZoom: 18,
        styles: theme == "dark" ? darkTheme : lightTheme
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""
    });

    const [map, setMap] = React.useState<google.maps.Map | null>(null);

    const zoomIn = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined && currentZoom < 18) {
                map.setZoom(currentZoom + 1);
            }
        }
    }, [map]);

    const zoomOut = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined && currentZoom > 4) {
                map.setZoom(currentZoom - 1);
            }
        }
    }, [map]);

    const handleMyLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (map) {
                    map.setCenter(userLocation);
                    map.setZoom(14)
                }
            }, error => {
                console.error('Error getting user location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, [map]);

    const onLoad = useCallback(function callback(mapInstance: any) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            options={mapOptions}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <div className="absolute bottom-5 right-1/2 translate-x-[calc(50%+25px)] sm:bottom-1/2 sm:translate-y-1/2 sm:right-5 sm:translate-x-0 flex sm:flex-col gap-1 items-center">
                <Button
                    className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                    onClick={zoomIn}
                >
                    <FiZoomIn />
                </Button>
                <Button
                    className="w-12 h-12 linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 shadow-xl"
                    onClick={handleMyLocation}
                >
                    <MdOutlineMyLocation className="w-8 h-8" />
                </Button>
                <Button
                    className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                    onClick={zoomOut}
                >
                    <FiZoomOut />
                </Button>
            </div>
        </GoogleMap>
    ) : <></>;
}

export default React.memo(MapExport);
