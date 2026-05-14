"use client";
import styles from './Menu.module.css';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';

export default function Menu() {
    const router = useRouter();

    function handleLogOut() {
        // Limpa o token do localStorage e expira o cookie
        clearToken();
        router.push('/Entrar');
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pathname = usePathname();
    return (
        <div className={styles.menuContent}>
            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.menuIconContainer}>
                <Icon icon="material-symbols:menu-rounded" className={styles.menuIcon} />
            </div>
            {isMenuOpen && (
                <div className={styles.overlay} onClick={() => setIsMenuOpen(false)}></div>
            )}
            <div className={`${styles.menuContainer} ${isMenuOpen ? styles.menuContainerOpen : ''}`} onClick={e => e.stopPropagation()}>
                <Link href="/" className={styles.titleMenu}>PostVision</Link>
                <div className={styles.menuLinks}>
                    <Link href="/Status" className={`${styles.link} ${pathname === '/Status' ? styles.active : ''}`}>
                        <Icon icon="gridicons:stats" className={styles.statsIcon} />Status
                    </Link>
                    <Link href="/Profile" className={`${styles.link} ${pathname === '/Profile' ? styles.active : ''}`}>
                        <Icon icon="iconamoon:profile-fill" className={styles.profileIcon} />Profile
                    </Link>
                    <Link href="/Camera" className={`${styles.link} ${pathname === '/Camera' ? styles.active : ''}`}>
                        <Icon icon="mdi:camera" className={styles.profileIcon} />Camera
                    </Link>
                </div>
                <button onClick={handleLogOut} className={styles.logoutContainer}>
                    <Icon icon="ri:logout-box-line" className={styles.logoutButton} />
                </button>
            </div>
        </div>
    );
}
